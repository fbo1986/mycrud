
var config = {
    headers: {
        'publicKey': ' c4a06916ca0a14d2eb21efbead5648003f94e5c5'
    }
}


new Vue({
    el: '#app',
    data: {
        users: [],
        errors: [],
        searchResult: [],        
        searchId: '',
        lname: '',
        fname: '',
        email: '',
        phone: '',
        d_lname: '',
        d_fname: '',
        d_email: '',
        d_phone: '',
        pagination: { currentPage: 1 },        
        setPage: function(pageNo) {
            this.pagination.currentPage = pageNo
        },
        pageChanged: function() {
            console.log('Page changed to: ' + this.pagination.currentPage)
               
            axios.get(`http://localhost:8080/data`)
                .then(response => {
                    //console.log(response.data)
                                    
                    this.users = response.data
             
                    var start = (this.pagination.currentPage -1) * 2 
                    this.users =  this.users.slice(start, start + 2)

                })
                .catch(e => {
                    console.log('error -> ' + e)
                    this.errors.push(e)
                })
               
            
        },
        totalItems: 100
        

    },    
    computed: {               
        noDeleted() {
            return this.users.filter(usr => usr.is_deleted == '0')

        }
    },
    methods: {
        /*getList() {

            axios.get(`http://localhost:8080/data`)
                .then(response => {
                    //console.log(response.data)
                                    
                    this.users = response.data
                    this.users = this.users.slice(0, 3) 

                })
                .catch(e => {
                    console.log('error -> ' + e)
                    this.errors.push(e)
                })

        },*/
        editUser(user_in) {

            user_in.is_editing = '1'
            this.d_fname = user_in.firstname
            this.d_lname = user_in.lastname
            this.d_email = user_in.email
            this.d_phone = user_in.phone
        },
        discardEdit(user_in) {
            user_in.is_editing = '0'
            

        },
        insertUsert(){       
                       
            axios.post('http://localhost:8080/data/', { 
                firstname: this.fname,
                lastname: this.lname,
                email: this.email,
                phone: this.phone,
                is_deleted: '0',
                is_editing: '0'

            }).then(function(response){
                console.log('register successfully')

            })

            this.users.push({
                firstname: this.fname,
                lastname: this.lname,
                email: this.email,
                phone: this.phone,
                is_deleted: '0',
                is_editing: '0'
            })  

            this.fname = '' 
            this.lname = ''
            this.email = ''
            this.phone = ''                       
            
        },
        updateUser(user_in) {
            //console.log('data ' + user_in.id, user_in.firstname, user_in.lastname)
            // Performing a PUT request
            axios.put('http://localhost:8080/data/' + user_in.id, {                    
                    firstname: this.d_fname,
                    lastname: this.d_lname,
                    email: this.d_email,
                    phone: this.d_phone,
                    is_deleted: '0',
                    is_editing: '0'
                  
                })
                .then(function(response) {
                    console.log('saved successfully')

                })

            user_in.firstname = this.d_fname
            user_in.lastname = this.d_lname
            user_in.email = this.d_email
            user_in.phone = this.d_phone                  
            user_in.is_deleted == '0'
            user_in.is_editing == '0'
            
            

        },
        deleteUser(user_in) {

            var mensaje = confirm("Estas seguro de eliminar el registro?");

            if (mensaje) {

                axios.delete('http://localhost:8080/data/' + user_in.id, )
                .then(function(response) {
                    console.log('delete successfully!!')

                })

                user_in.is_editing = '2'

            }else {
                console.log('Accion cancelada')
            }
        },
        searchUser(){            
            console.log(this.searchId)
            

            axios.get(`http://localhost:8080/data/` + this.searchId)
                .then(response => {

                    console.log(response)
                    this.searchResult = response.data            

                })
                .catch(e => {
                    this.searchResult = []

                }) 
        },
        loadData () {
            this.pageChanged()

        }


    },    
    mounted() {
        //this.getList()
        this.loadData()
    }
})
    