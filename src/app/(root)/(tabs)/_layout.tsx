import { Tabs } from 'expo-router'

const TabsLayout = () => {
  return (
    <Tabs backBehavior='history' screenOptions={{headerShown:false}}/>
  )
}

export default TabsLayout