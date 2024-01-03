import React from 'react'
/**********/
const BookList = React.lazy(() => import('./views/Book/list'))
const AuthorList = React.lazy(() => import('./views/Author/list'))
const SubjectList = React.lazy(() => import('./views/Subject/list'))
const ReportView = React.lazy(() => import('./views/Report/report'))
const Login     = React.lazy(() => import('./pages/Login'))
/**********/

const routes = [
    {
        path: '/',
        name: 'Livros',
        exact: true,
        component: BookList
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },{
        path: '/Book/list',
        name: 'Listagem de Livros',
        component: BookList
    },{
        path: '/Author/list',
        name: 'Listagem de Autores',
        component: AuthorList
    },{
        path: '/Subject/list',
        name: 'Listagem de Assuntos',
        component: SubjectList
    },{
        path: '/Report',
        name: 'Relatório',
        component: ReportView
    }
]

export default routes
