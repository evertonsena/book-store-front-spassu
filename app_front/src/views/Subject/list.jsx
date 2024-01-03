import React, { Component } from "react"
import MultiGrid from "../../components/multigrid";

class CSDatatable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: 'Listagem dos Assuntos',
        }
    }

    render() {

        const { title, options } = this.state
        const columns = [
            {
                name: "codas",
                label: "ID",
                type: "primary_key",
                visible: {                    
                    list: true,
                    create: true,
                    update: true
                }
            },
            {
                name: "descricao",
                label: "Descrição",
                visible: {
                    list: true,
                    create: true,
                    update: true
                }
            }
        ]

        const events = {
            route: "/subjects/",
            create: {
                title : "Cadastrar Assunto"
            },
            update: {
                title: "Alterar Assunto",
                customRoute: "/subjects/",
                onBefore: function (){}
            },
            delete: {
                title: "Remover Assunto",
                question: "Deseja mesmo remover esse Assunto?",
                questionMultiple: "Deseja mesmo remover os Assunto?",
                multiple: true
            },
        }

        return (
            <MultiGrid
                scope="Assuntos"
                title={title}
                columns={columns}
                options={options}
                events={events}
            />
        )

    }
}
export default CSDatatable