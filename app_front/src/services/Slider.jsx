// @flow
import React, { Component } from "react"
import BackgroundSlider from 'react-background-slider'

class Slider extends Component {
    render () {
        return (
            <div>
                <BackgroundSlider
                    images={this.props.images}
                    duration={5}
                    transition={1}
                />
            </div>
        )
    }
}
export default Slider