
var config = {
    headers: {
        'publicKey': ' c4a06916ca0a14d2eb21efbead5648003f94e5c5'
    }
}

axios.defaults.baseURL = 'http://localhost:8080/';

new Vue({
    el: '#app',
    data: {
        users: [],        
        searchResult: [],        
        searchByName: '',  
        lastName: '',
        firstName: '',
        email: '',
        phone: '',
        editInputFirstName: '',
        editInputLastName: '',
        editInputEmail: '',
        editInputPhone: '',
        editIsDeleted: false,
        editIsEditing: false,
        pagination: { currentPage: 1 },        
        totalItems: 0,
        setPage: function(pageNo) {
            console.log('setPage....')            
            this.pageChanged()
            this.searchByName = ''
        },
        pageChanged: function() {
            console.log('pageChanged.......')

            axios.get(`data?is_deleted=false`)
                .then(response => {
                                    
                    this.users = response.data
                    this.totalItems = this.users.length
                    
                    var start = (this.pagination.currentPage -1) * 10 
                    this.users =  this.users.slice(start, start + 10)

                })
                .catch(e => {
                    console.log('error -> ' + e)
                    
                })
               
            
        }
        

    },
    mounted() {

        this.loadData()

    },    
    computed: {               
        noDeleted() {
            return this.users.filter(usr => usr.is_deleted == '0')

        }
    },
    methods: {
        loadData (locate_in) {
            if(locate_in == null) locate_in = 'def'

            console.log('loadData....' + locate_in)
            this.pageChanged()

        },
        editUser(user_in) {
                    
            var responseObject = []
            user_in.is_editing = true            

            // Performing a GET request
            axios.get(`data/` + user_in.id)
                .then(response => {
                    
                    responseObject = response.data                                                    
                    this.editInputFirstName = responseObject["firstname"].toString()
                    this.editInputLastName = responseObject["lastname"].toString()
                    this.editInputEmail = responseObject["email"].toString()
                    this.editInputPhone = responseObject["phone"].toString()
                    this.editIsEditing = responseObject["is_editing"]
                    this.editIsDeleted = responseObject["is_deleted"]

                })
                .catch(e => {
                   console.log('err->' + e)

                })

                        
        },
        discardEdit(user_in) {
            user_in.is_editing = false
            

        },
        insertUsert(){    
            var self = this

            // Performing a POST request         
            axios.post('data/', { 
                firstname: this.firstName,
                lastname: this.lastName,
                email: this.email,
                phone: this.phone.toString(),
                is_deleted: this.editIsDeleted,
                is_editing: this.editIsEditing

            }).then(function(response){
                alert('Registro exitoso (-.-)/ ')
                self.loadData()
                
            })
            
            this.firstName = '' 
            this.lastName = ''
            this.email = ''
            this.phone = ''                       
            
        },
        updateUser(user_in) {            
            var locate = 'fn >> updateUser'  
            var self = this

            // Performing a PUT request
            axios.put('data/' + user_in.id, {   

                    firstname: this.editInputFirstName,
                    lastname: this.editInputLastName,
                    email: this.editInputEmail,
                    phone: this.editInputPhone,
                    is_deleted: this.editIsDeleted,
                    is_editing: this.editIsEditing
                  
                }
            )
            .then(function(response) {               
                user_in.is_editing = false
                alert('Elemento actualizado correctamente (-.-)/ ')            
                self.loadData()
            })


        },
        deleteUser(user_in) {
            var self = this
            var message = confirm("Estas seguro de eliminar el registro?");
             
            if (message) {

                axios.delete('data/' + user_in.id, )
                .then(function(response) {
                    alert('Elemento borrado correctamente (-.-)/ !!')
                    self.loadData()
                })
                

            }else {
                console.log('Accion cancelada')
            }
        },
        searchUser(){                          
            // Performing a GET request
            axios.get(`data?firstname=` + this.searchByName)
                .then(response => {

                    console.log('response.data>>>' + response.data )
                    this.users = response.data

                })
                .catch(e => {
                    console.log('err->' + e)

                })
                            
        }


    }
})
    