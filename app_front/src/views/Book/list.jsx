import React, { Component } from "react"
import MultiGrid from "../../components/multigrid";

class CSDatatable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: 'Listagem dos Livros',
        }
    }

    render() {

        const { title, options } = this.state
        const columns = [
            {
                name: "codl",
                label: "ID",
                type: "primary_key",
                visible: {                    
                    list: true,
                    create: true,
                    update: true
                }
            },
            {
                name: "titulo",
                label: "Título",
                visible: {
                    list: true,
                    create: true,
                    update: true
                }
            },
            {
                name: "editora",
                label: "Editora",
                visible: {
                    list: true,
                    create: true,
                    update: true
                }
            },
            {
                name: "edicao",
                label: "Edição",
                type: 'number',
                visible: {
                    list: true,
                    create: true,
                    update: true
                }
            },
            {
                name: "anopublicacao",
                label: "Publicado em",
                type: 'number',
                max: 4,
                visible: {
                    list: true,
                    create: true,
                    update: true
                }
            },
            {
                name: "valorFormatado",
                label: "Valor",
                type: 'number',
                visible: {
                    list: true,
                    create: false,
                    update: false
                }
            },
            {
                name: "valor",
                label: "Valor",
                type: 'number',
                placeholder: '$0.00',
                visible: {
                    list: false,
                    create: true,
                    update: true
                }
            },
            {
                name: "autores",
                label: 'Autores',
                visible: {
                    list: false,
                },
                type: 'multiple-select',
                select: {
                    multiple: true,
                    autoload: true,
                    route: 'authors',
                    label: 'nome',
                    value: 'codau'
                }

            },
            {
                name: "assuntos",
                label: 'Assuntos',
                visible: {
                    list: false,
                },
                type: 'multiple-select',
                select: {
                    multiple: true,
                    autoload: true,
                    route: 'subjects',
                    label: 'descricao',
                    value: 'codas'
                }

            },
        ]

        const events = {
            route: "/books/",
            create: {
                title : "Cadastrar Livro"
            },
            update: {
                title: "Alterar Livro",
                customRoute: "/books/",
                onBefore: function (){}
            },
            delete: {
                title: "Remover Livro",
                question: "Deseja mesmo remover esse Livro?",
                questionMultiple: "Deseja mesmo remover os Livros?",
                multiple: true
            },
        }

        return (
            <MultiGrid
                scope="Livros"
                title={title}
                columns={columns}
                options={options}
                events={events}
            />
        )

    }
}
export default CSDatatable