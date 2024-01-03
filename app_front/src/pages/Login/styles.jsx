import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100vh;
`;

export const AuthBox = styled.div`
    height: 100%;
    max-width: 400px;
    width: 90%;
    margin: 0;
    padding: 40px;
    box-sizing: border-box;
    box-shadow: 1px 0 20px rgba(0,0,0,.08);
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const Header = styled.header`

`;

export const ImageFull = styled.img`
    width: 100%;
    height: 100%;
    obejct-fit: cover;
    object-position: center;
`;

export const Form = styled.form`
    input {
        position: relative;
        flex: 1 1 auto;
        width: 1%;
        height: calc(2.64063rem + 2px);
        padding: .5rem 1rem;
        font-size: 1.09375rem;
        line-height: 1.5;
        border-radius: 2px;
        background-color: #fff;
        border: 1px solid #e9ecef;
        box-sizing: border-box;
        font-size: 15px;
        color: #4F5467;
        transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        &::placeholder {
            color: #999;
        }
    }

    button {
        color: #fff;
        font-size: 16px;
        background: #005C97;
        border: 1px solid #005C97;
        height: 40px;
        border-radius: 5px;
        width: 100%;
        cursor: pointer;
        transition: all .3s ease-in-out;
    }
    button:hover{
        background: transparent;
        color: #005C97;
    }

    .lost-password{
        font-size: 15px;
        text-align: right;
        width: 100%;
        display: block;
        padding-top: 30px;
        color: #a7a7a7;
        text-decoration: none;
        cursor: pointer;
        transition: all .3s ease-in-out;
    }
    .lost-password:hover{
        color: #005C97;
    }
`;
export const InputGroup = styled.div`
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    width: 100%;
    margin-bottom: 1rem;
`;
export const InputGroupPrepend = styled.div`
    display: flex;
    margin-right: -1px;
`;
export const InputGroupText = styled.div`
    display: flex;
    align-items: center;
    padding: .375rem .75rem;
    font-size: .875rem;
    line-height: 1.5;
    color: #4F5467;
    text-align: center;
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 2px;
`;

export const Footer = styled.footer`
    .copyright {
        line-height: 1;
        text-align: center;
        color: #a7a7a7;
        font-size: 13px;
        font-weight: 500;
        margin: 0;
    }
`;