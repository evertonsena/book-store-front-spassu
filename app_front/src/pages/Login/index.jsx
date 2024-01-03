// @flow
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Api from "../../services/Api";
import { login } from "../../services/auth";
import Slider from "../../services/Slider";

import {
  Container,
  AuthBox,
  Header,
  Footer,
  Form,
  InputGroup,
  InputGroupPrepend,
  InputGroupText
} from "./styles";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: "",
      imageUrls: [
        require("../../assets/images/background/0.png"),
        require("../../assets/images/background/1.png"),
        require("../../assets/images/background/2.png"),
        require("../../assets/images/background/3.png")
      ]
    };
  }

  handleSignIn = async e => {
    e.preventDefault();
    const { email, password } = this.state;

    if (!email || !password) {
      this.setState({ error: "Preencha e-mail e senha para continuar!" });
    } else {
      try {
        this.props.history.push("/");
      } catch (err) {
        this.setState({
          error: "Usuário não encontrado."
        });
      }
    }
  };

  render() {
    return (
      <Container>
        <Slider images={this.state.imageUrls} />
        <AuthBox>
          <Header>
            <h4>Sistema de Livraria - SPASSU</h4>
            <br/>
            <br/>
            <Form onSubmit={this.handleSignIn}>
              {this.state.error && <p>{this.state.error}</p>}
              <InputGroup>
                <InputGroupPrepend>
                  <InputGroupText>
                    <i className="icon-user"></i>
                  </InputGroupText>
                </InputGroupPrepend>
                <input
                  type="email"
                  name="email"
                  placeholder="Endereço de e-mail"
                  required
                  onChange={e => this.setState({ email: e.target.value })}
                />
              </InputGroup>
              <InputGroup>
                <InputGroupPrepend>
                  <InputGroupText>
                    <i className="icon-lock"></i>
                  </InputGroupText>
                </InputGroupPrepend>
                <input
                  type="password"
                  name="password"
                  placeholder="Senha"
                  onChange={e => this.setState({ password: e.target.value })}
                />
              </InputGroup>
              <button type="submit">Entrar</button>

              <Link to="/lost-password" className="lost-password">
                <i className="fa fa-key"></i> Esqueceu sua senha?
              </Link>
            </Form>
          </Header>
          <Footer>
            <p className="copyright">&copy; 2024 - Desenvolvido por Everton Sena.</p>
          </Footer>
        </AuthBox>
      </Container>
    );
  }
}

export default withRouter(Login);
