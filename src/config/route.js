import Login from '../views/Login'
import Chat from '../views/Chat'
import Register from '../views/Register'
import Prueba from '../components/Prueba'
import Categoria from '../components/Categoria';
import ChatActivos from '../views/CitasActivas'
import Registro from '../views/Registros'
import Inactivos from '../views/ChatsInactivos'
import TabViewChat from '../views/TabViewChat';

export const route = {
    login:Login,
    prueba:Prueba,
    chat:Chat,
    register:Register,
    activos:ChatActivos,
    registro:Registro,
    inactivos:Inactivos,
    tabViewChat:TabViewChat
}

export default route