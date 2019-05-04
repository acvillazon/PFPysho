import Login from '../views/Login'
import Chat from '../views/Chat'
import Register from '../views/Register'
import Prueba from '../components/ZoomImage'
import Categoria from '../components/Categoria';
import ChatActivos from '../views/CitasActivas'
import Registro from '../views/Registros'
import Inactivos from '../views/ChatsInactivos'
import TabViewChat from '../views/TabViewChat';
import Upload from '../components/Upload'
import Calendar from '../views/Calendar'
import PdfReader from '../components/PdfReader'
import EmergencyCall from '../components/EmergencyCall'
import CategoriasForo from '../views/CategoriasForo'
import Foro from '../views/Foro'
import Comentarios from '../views/Comentarios'
import CreateEvent from '../views/CreateEvent'
import DateTime from '../views/TimeDatePcker'
import Menu from '../views/Menu'
import Reader from '../components/RenderChatActivos'
import PruebaReact from '../views/PruebaReact'


export const route = {
    login:Login,
    prueba:Prueba,
    chat:Chat,
    register:Register,
    activos:ChatActivos,
    registro:Registro,
    inactivos:Inactivos,
    createEvent:CreateEvent,
    datetime:DateTime,
    tabViewChat:TabViewChat,
    calendar:Calendar,
    upload:Upload,
    pdfreader:PdfReader,
    emergencycall: EmergencyCall,
    categoriasforo: CategoriasForo,
    foro:Foro,
    comentarios: Comentarios,
    menu:Menu,
    reader:Reader,
}

export default route