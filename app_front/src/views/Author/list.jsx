import React, { Component } from "react"
import MultiGrid from "../../components/multigrid";

class CSDatatable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: 'Listagem dos Autores',
        }
    }

    render() {

        const { title, options } = this.state
        const columns = [
            {
                name: "codau",
                label: "ID",
                type: "primary_key",
                visible: {                    
                    list: true,
                    create: true,
                    update: true
                }
            },
            {
                name: "nome",
                label: "Nome",
                visible: {
                    list: true,
                    create: true,
                    update: true
                }
            }
        ]

        const events = {
            route: "/authors/",
            create: {
                title : "Cadastrar Autor"
            },
            update: {
                title: "Alterar Autor",
                customRoute: "/authors/",
                onBefore: function (){}
            },
            delete: {
                title: "Remover Autor",
                question: "Deseja mesmo remover esse Autor?",
                questionMultiple: "Deseja mesmo remover os Autores?",
                multiple: true
            },
        }

        return (
            <MultiGrid
                scope="Autores"
                title={title}
                columns={columns}
                options={options}
                events={events}
            />
        )

    }
}
export default CSDatatable