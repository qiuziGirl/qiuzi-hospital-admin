const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  id: state => state.user.id,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  name: state => state.user.name
}
export default getters
