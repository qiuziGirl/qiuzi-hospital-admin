import { resetRouter } from '@/router'
import { generateHashString } from '@/utils'
import { getToken, setToken, removeToken } from '@/utils/auth'

const getDefaultState = () => {
  return {
    token: getToken(),
    id: '',
    name: '',
    roles: [],
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  async login ({ commit }, userInfo) {
    const { username, password } = userInfo
    const passwordHash = await generateHashString(password)

    return $api.common.login({ name: username.trim(), password: passwordHash }).then(data => {
      const { token } = data
      commit('SET_TOKEN', token)
      setToken(token)
    })
  },

  // get user info
  async getInfo ({ commit, state }) {
    try {
      const data = await $api.common.getInfo({ token: state.token })
      if (!data) {
        throw new Error('Verification failed, please login again.')
      }

      const { id, name, role, avatar } = data

      commit('SET_ID', id)
      commit('SET_NAME', name)
      commit('SET_ROLES', role)
      commit('SET_AVATAR', avatar)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  // user logout
  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      $api.common.logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        commit('SET_ROLES', [])
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      commit('SET_ROLES', [])
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
