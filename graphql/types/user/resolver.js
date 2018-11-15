module.exports = {
    resolver: {
        User: {
            id: () => 1,
            nome: () => 'Nero',
            sobrenome: () => 'Rodrigues'
        },
        Query: {
            user: () => {
                return {
                    id: 2,
                    nome: 'Rodrigues',
                    sobrenome: 'Nero'
                }
            }
        }
    }
}