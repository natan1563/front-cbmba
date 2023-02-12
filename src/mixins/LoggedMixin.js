import axios from "axios";
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['getUserToken']),
  },
  methods: {
    async isLogged() {
     try {
      const token = this.getUserToken || localStorage.getItem('accessToken');
      
      if (!token)
        throw new Error('Para ter acesso a esta página por favor realize o seu login.');
      
      const apiUrl = 'http://localhost:8000/api';
      const tokenIsValid = await axios.get(`${apiUrl}/auth/check`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (tokenIsValid.status === 401)
        throw new Error('Sessão expirada');

     } catch (err) {
       this.$router.push({name: 'auth-user'});
     }
    },
  },
}