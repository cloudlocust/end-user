pipeline{
    agent any
    tools {nodejs "node14"}
    environment{
        GITHUB_CREDENTIALS = credentials('github myem developer')
        DISCORD_WEBHOOK_URL = credentials('discord-webhook')
    }

    stages{
        stage ('Install deps') {
            steps {
                sh 'npm install -g yarn && yarn install && export NODE_OPTIONS="--max-old-space-size=8192"'
            }
        }
        stage ('Eslint') {
            steps {
                sh 'npx eslint . --max-warnings=0'
            }
        }
        stage('Typescript') {
            steps {
                sh 'npx tsc --skipLibCheck'
            }

        }
        stage('Unit-test'){
            steps {
                sh 'yarn test --watchAll=false --maxWorkers=1 --no-cache  --coverage --testResultsProcessor jest-sonar-reporter'
            }

        }
        stage('build && SonarQube analysis') {
            environment {
                scannerHome = tool 'SonarQubeScanner'
            }
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh "${scannerHome}/bin/sonar-scanner -X"
                }
            }
        }
        stage("Quality Gate") {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    // Parameter indicates whether to set pipeline to UNSTABLE if Quality Gate fails
                    // true = set pipeline to UNSTABLE, false = don't
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        stage('Test NG generate') {
            when {
              expression { ! (BRANCH_NAME ==~ /(production|master|develop)/) }
            }
            steps{
               sh 'yarn build'
            }
        }
        stage("Publish") {
            when {
                    expression { BRANCH_NAME ==~ /(production|master|develop)/ }
            }
            environment {
                registryCredential = 'dockerhub'
                app_regisgtry = 'myem/enduser-react'
                IMG_TAG = getImgTag(BRANCH_NAME)
                ENV_BUILD = getBuildEnv(BRANCH_NAME)
            }
            steps{
                script {
                    docker.withRegistry( '', registryCredential ) {
                        // we copy files inside the app image and tag it
                        def appimage = docker.build(app_regisgtry + ":${IMG_TAG}", "--no-cache --build-arg ENV=${ENV_BUILD} --build-arg REACT_APP_TITLE='NED | Nouvelle Energies Distribution' --build-arg REACT_APP_CLIENT_ICON_FOLDER='ned' . -f ci/Dockerfile " )
                        appimage.push("${IMG_TAG}")
                    }
               }
            }

        }
        stage("Deploy-prod") {
            when {
                    expression { BRANCH_NAME ==~ /(production)/ }
            }
            environment {
              SERVER_SSH_KEY = credentials('contabo-test-env-private-key')
              SERVER_IP = getIp(BRANCH_NAME)
              SERVER_USER = getUser(BRANCH_NAME)
              ENV_NAME = getEnvName(BRANCH_NAME)
           }
            steps {
                sh "./ci/deploy.sh ${SERVER_USER} ${SERVER_IP} ${SERVER_SSH_KEY} /${SERVER_USER}/enduser-react-devops/${ENV_NAME}"
           }
           post {
                success{
                    discordSend (description: "Jenkins ${ENV_NAME} Pipeline Build Success", footer: "enduser-react has been deployed", link: env.BUILD_URL, result: currentBuild.currentResult, title: JOB_NAME, webhookURL: "${DISCORD_WEBHOOK_URL}")
                }
                failure{
                    discordSend (description: "Jenkins ${ENV_NAME} Pipeline Build Failed", footer: "there was an error  in the enduser-react deployment", link: env.BUILD_URL, result: currentBuild.currentResult, title: JOB_NAME, webhookURL: "${DISCORD_WEBHOOK_URL}")
                }
           }
        }
       stage ('Deploy-alpha/staging') {
        when {
                expression { BRANCH_NAME ==~ /(master|develop)/ }
           }
        environment {
              ENV_NAME = getEnvName(BRANCH_NAME)
           }
            steps {
                script{
                    // The below will clone network devops repository
                    git credentialsId: 'github myem developer', url: 'https://github.com/myenergymanager/network-devops'
                    // Checkout to master
                    sh "git checkout master"
                    // This will apply new helm upgrade, you need to specify namespace.
                    withKubeConfig([credentialsId:'kubernetes_staging-alpha-preprod', serverUrl:'https://aba74d96-42a7-4fd9-9bcf-46b243e3c48f.api.k8s.fr-par.scw.cloud:6443']) {
                        sh "helm upgrade --install enduser-react-ng${ENV_NAME} helm-charts/enduser-react -f environments/ng${ENV_NAME}/microservices/enduser-react.yaml --namespace ng${ENV_NAME}"
                    }
                }
            }
            post {
                success{
                    discordSend (description: "Jenkins ${ENV_NAME} Pipeline Build Success", footer: "enduser-react has been deployed", link: env.BUILD_URL, result: currentBuild.currentResult, title: JOB_NAME, webhookURL: "${DISCORD_WEBHOOK_URL}")
                }
                failure{
                    discordSend (description: "Jenkins ${ENV_NAME} Pipeline Build Failed", footer: "there was an error  in the enduser-react deployment", link: env.BUILD_URL, result: currentBuild.currentResult, title: JOB_NAME, webhookURL: "${DISCORD_WEBHOOK_URL}")
                }
            }
       }
    }
}


def getIp(branchName) {
     // This function return the ip of the adrress.
     if(branchName == "master")  {
         return "alpha.enduser.myem.io";
     }
     // production branch is deployed manually in prod and automatically in preprod.
     else if (branchName == "production"){
         return "preprod.enduser.myem.io";
     }
     else {
         return "staging.enduser.myem.io";
     }
}

def getUser(branchName) {
     // This function return the user per branch.
     if(branchName == "master")  {
         return "root";
     }
     // production branch is deployed manually in prod and automatically in preprod.
     else if (branchName == "production"){
         return "root";
     }
     else {
         return "root";
     }
}

def getImgTag(branchName) {
     // This function return staging by default.
     if(branchName == "master")  {
         return "alpha";
     }
     else if (branchName == "production"){
         return "prod";
     }
     else {
         return "staging";
     }
}

def getEnvName(branchName) {
     // This function return staging by default.
     if(branchName == "master")  {
         return "alpha";
     }
     // production branch is deployed manually in prod and automatically in preprod.
     else if (branchName == "production"){
         return "preprod";
     }
     else {
         return "staging";
     }
}

def getBuildEnv(branchName) {
     // This function return staging by default.
     if(branchName == "develop")  {
         return "development";
     }
     else if (branchName == "production"){
         return "production";
     }
     else{
         return "alpha";
     }
}
