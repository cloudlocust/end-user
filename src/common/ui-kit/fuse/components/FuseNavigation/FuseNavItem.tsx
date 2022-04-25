import { IFuseNavigationComponentProps } from './FuseNavigation'

// This component is used to determine witch component to use when calling fuseNavItem based on his type.
/**
 * Type of the variable (components) that stocks our components.
 */
interface IComponentsRecord {
    [componentTypeName: string]: React.FC<IFuseNavigationComponentProps>
}

const components = {} as IComponentsRecord

/**
 * This function registers each component based on it's type value.
 * For exemple we will have the pair { 'vertical-collapse', <FuseNavVerticalCollapse/> }.
 *
 * @param name Name of the component that we will index with it.
 * @param Component The component witch we will use.
 */
export function registerComponent(name: string, Component: React.FC<IFuseNavigationComponentProps>) {
    components[name] = Component
}

/**
 * Navigate based on the component's Type.
 * When calling FuseNavItem we check the props.type.
 * If we have registered a component to use for that specific type we use it, otherwise we send back null.
 *
 * @param props Props for the navigation.
 * @returns Jsx Element or null.
 */
export default function FuseNavItem(props: IFuseNavigationComponentProps) {
    const C = components[props.type!] as React.FC<IFuseNavigationComponentProps>
    return C ? <C {...props} /> : null
}
