pipeline{
    agent { label 'jenkins-jenkins-react ' }
    tools {nodejs "node16"}
    environment{
        GITHUB_CREDENTIALS = credentials('github myem developer')
        DISCORD_WEBHOOK_URL = credentials('discord-webhook')
    }

    stages{
        stage ('Install deps') {
            steps {
                // Using ignore-engines, will fix the error "engine node incompatible with this module", when using yarn install which happens on jenkins after installing firebase package.
                sh 'npm install -g yarn && yarn install --ignore-engines && export NODE_OPTIONS="--max-old-space-size=8192"'
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
                sh 'yarn test --bail --watchAll=false --maxWorkers=2 --no-cache  --coverage --testResultsProcessor jest-sonar-reporter'
            }

        }
        // stage('build && SonarQube analysis') {
        //     environment {
        //         scannerHome = tool 'SonarQubeScanner'
        //         sonarqube_Token = credentials('sonarq-token')
        //         sonar_host = credentials('sonarq-host')
        //     }
        //     steps {
        //         withSonarQubeEnv('sonarqube') {
        //         script {
        //             // Execute shell command to set directory variable
        //             directory = sh(returnStdout: true, script: 'pwd').trim()
        //             // execute sonarqube command directly in the agent pod using kubectl exec command
        //             sh "kubectl exec -it \$NODE_NAME -n jenkins -- /bin/bash -c ' cd ${directory} && export SONAR_HOST_URL=${sonar_host} && ${scannerHome}/bin/sonar-scanner -Dsonar.login=${sonarqube_Token} -X ' "

        //         }

        //         }
        //     }
        // }
        // stage("Quality Gate") {
        //     steps {
        //         timeout(time: 10, unit: 'MINUTES') {
        //             // Parameter indicates whether to set pipeline to UNSTABLE if Quality Gate fails
        //             // true = set pipeline to UNSTABLE, false = don't
        //             waitForQualityGate abortPipeline: true
        //         }
        //     }
        // }
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
           stages {
           stage('Publish in dockerhub'){
            environment {
                registryCredential = 'dockerhub'
                app_regisgtry = 'myem/enduser-react'
                ENV_NAME = getEnvName(BRANCH_NAME)
                ENV_BUILD = getBuildEnv(BRANCH_NAME)
                DOCKER_BUILDKIT='1'
                VERSION= "${BUILD_NUMBER}"                
            }
            steps{
                script {
                    docker.withRegistry( '', registryCredential ) {
                        // we copy files inside the app image and tag it
                        def appimage = docker.build(app_regisgtry + ":${ENV_NAME}", "--build-arg ENV=${ENV_BUILD} --build-arg REACT_APP_TITLE='MYEM | Application de suivi de consommation ' --build-arg REACT_APP_CLIENT_ICON_FOLDER='ned' . -f ci/Dockerfile " )
                        appimage.push("${ENV_NAME}")
                        if (env.BRANCH_NAME == "production") {                                          
                        appimage.push("${ENV_NAME}-${VERSION}")   
                        }                         
                    }
                    // Clean up unused Docker resources older than 1 hour
                    sh 'docker system prune -af --filter "until=1h"'                        
               }
            }

        } 
           }
        }
        stage('Publish in chart regisry'){
                    when{  
                        expression { BRANCH_NAME ==~ /(production|master|develop)/ }
                        expression { changeset('enduser-react-chart')} 
                        }
                    environment {
                        ENV_NAME = getEnvName(BRANCH_NAME)
                        VERSION_CHART = "0.1.${BUILD_NUMBER}"
                        USER_NAME_ = credentials('helm_registry_username')
                        PASSWORD_ = credentials('helm_registry_password')
                        url = credentials('helm_registry_url')
                        URL_ = "${url}/${ENV_NAME}registry"
                        }
                    steps {
                            script{

                            sh(script: " helm registry login -u ${USER_NAME_} -p ${PASSWORD_} ${URL_} ")
                            sh(script: "rm -rf helm-chart-repository")
                            sh(script: "mkdir helm-chart-repository")         
                            sh(script: "helm package enduser-react-chart --version ${VERSION_CHART} -d helm-chart-repository")
                            sh(script: "helm push helm-chart-repository/* oci://${URL_}")
                            sh(script: "rm -rf helm-chart-repository")

            }
            }  

            } 

       stage ('Deploy') {
        when {
                expression { BRANCH_NAME ==~ /(master|develop|production)/ }
           }
        environment {
              ENV_NAME = getEnvName(BRANCH_NAME)
              USER_NAME_ = credentials('helm_registry_username')
              PASSWORD_ = credentials('helm_registry_password')
              url = credentials('helm_registry_url')
              URL_ = "${url}/${ENV_NAME}registry"
                            
           }
            steps {
                script{
                    // The below will clone network devops repository
                    git([url: 'https://github.com/myenergymanager/network-devops', branch: "master", credentialsId: 'github myem developer'])
                    // Checkout to master
                    sh " helm registry login -u ${USER_NAME_} -p ${PASSWORD_} ${URL_} "
                    // This will apply new helm upgrade, you need to specify namespace.


                    withKubeConfig([credentialsId:'kubernetes_staging-alpha-preprod', contextName: "ng${ENV_NAME}"]) {
                        sh "sh ./deployments-scripts/deploy.sh enduser-react ng${ENV_NAME} ${URL_}"
                        
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

def allChangeSetsFromLastSuccessfulBuild() { 
    def jobName="$JOB_NAME"
    def job = Jenkins.getInstance().getItemByFullName(jobName)
    def lastSuccessBuild = job.lastSuccessfulBuild.number as int
    def currentBuildId = "$BUILD_ID" as int
    
    def changeSets = []

    for(int i = lastSuccessBuild + 1; i < currentBuildId; i++) {
        echo "Getting Change Set for the Build ID : ${i}"
        def chageSet = job.getBuildByNumber(i).getChangeSets()
        changeSets.addAll(chageSet)
    }
     changeSets.addAll(currentBuild.changeSets) // Add the  current Changeset
     return changeSets
}

def getFilesChanged(chgSets) {
    def filesList = []
    def changeLogSets = chgSets
        for (int i = 0; i < changeLogSets.size(); i++) {
            def entries = changeLogSets[i].items
            for (int j = 0; j < entries.length; j++) {
                def entry = entries[j]
                def files = new ArrayList(entry.affectedFiles)
                    for (int k = 0; k < files.size(); k++) {
                    def file = files[k]
                    filesList.add(file.path)
            }
        }
    }
    return filesList
}

def isPathExist(changeSets,path) {
    
            b = false
            changeSets.each { 
                a = it.startsWith(path)
                b = a || b
            }
            return b
            
    
}
def isJustPathExist(changeSets,path) {
    
            b = true
            changeSets.each { 
                a = it.startsWith(path)
                b = a && b
            }
            return b
            
    
}
def changeset(path){
    def jobName="$JOB_NAME"
    def job = Jenkins.getInstance().getItemByFullName(jobName)
    if ( job.lastSuccessfulBuild == null) { return true }    
    def changeSets = allChangeSetsFromLastSuccessfulBuild()                                          
    return  isPathExist(getFilesChanged(changeSets),path)

}

