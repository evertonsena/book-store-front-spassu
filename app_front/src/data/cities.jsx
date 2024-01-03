import React, { Component } from "react"
import PropTypes from 'prop-types'
import { 
    MenuItem, 
    FormControl, 
    Select 
} from '@material-ui/core'

class Cities extends Component {
    static propTypes = {
        value: PropTypes.string.isRequired,
        index: PropTypes.number.isRequired,
        change: PropTypes.func.isRequired
    }

    render() {
        const { value, index, change } = this.props
        const cities = [
            "Angra dos Reis",
            "Aperibé",
            "Araruama",
            "Areal",
            "Armação de Búzios",
            "Arraial do Cabo",
            "Barra do Piraí",
            "Barra Mansa",
            "Belford Roxo",
            "Bom Jardim",
            "Bom Jesus do Itabapoana",
            "Cabo Frio",
            "Cachoeiras de Macacu",
            "Cambuci",
            "Campos dos Goytacazes",
            "Cantagalo",
            "Carapebus",
            "Cardoso Moreira",
            "Carmo",
            "Casimiro de Abreu",
            "Comendador Levy Gasparian",
            "Conceição de Macabu",
            "Cordeiro",
            "Duas Barras",
            "Duque de Caxias",
            "Engenheiro Paulo de Frontin",
            "Guapimirim",
            "Iguaba Grande",
            "Itaboraí",
            "Itaguaí",
            "Italva",
            "Itaocara",
            "Itaperuna",
            "Itatiaia",
            "Japeri",
            "Laje do Muriaé",
            "Macaé",
            "Macuco",
            "Magé",
            "Mangaratiba",
            "Maricá",
            "Mendes",
            "Mesquita",
            "Miguel Pereira",
            "Miracema",
            "Natividade",
            "Nilópolis",
            "Niterói",
            "Nova Friburgo",
            "Nova Iguaçu",
            "Paracambi",
            "Paraíba do Sul",
            "Parati",
            "Paty do Alferes",
            "Petrópolis",
            "Pinheiral",
            "Piraí",
            "Porciúncula",
            "Porto Real",
            "Quatis",
            "Queimados",
            "Quissamã",
            "Resende",
            "Rio Bonito",
            "Rio Claro",
            "Rio das Flores",
            "Rio das Ostras",
            "Rio de Janeiro",
            "Santa Maria Madalena",
            "Santo Antônio de Pádua",
            "São Fidélis",
            "São Francisco de Itabapoana",
            "São Gonçalo",
            "São João da Barra",
            "São João de Meriti",
            "São José de Ubá",
            "São José do Vale do Rio Preto",
            "São Pedro da Aldeia",
            "São Sebastião do Alto",
            "Sapucaia",
            "Saquarema",
            "Seropédica",
            "Silva Jardim",
            "Sumidouro",
            "Tanguá",
            "Teresópolis",
            "Trajano de Morais",
            "Três Rios",
            "Valença",
            "Varre-Sai",
            "Vassouras",
            "Volta Redonda"
        ]
    
        return (
            <FormControl>
                <Select 
                    value={value} 
                    onChange={event => change(event.target.value, index)} 
                    style={{fontSize: 'inherit'}}
                >
                    {cities.map((city, index) =>
                        <MenuItem 
                            key={index} 
                            value={city}
                        >
                            {city}
                        </MenuItem>
                    )}
                </Select>
            </FormControl>
        )
    }
}

export default Cities