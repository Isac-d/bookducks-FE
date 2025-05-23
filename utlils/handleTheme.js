import { fetchData } from "./fetchData.js"
const BASE_URL = "http://localhost:1337";


const fetchTheme = async()=> {
    const url = `${BASE_URL}/api/theme`
    const themeData = await fetchData(url)
    const currentTheme = themeData.Theme
    return currentTheme
}

const handleTheme = async()=> {
    const currentTheme = await fetchTheme()
    const logoColor = document.querySelectorAll('.logo-yellow')
    const buttons = document.querySelectorAll('button')
    const bookLink = document.querySelector('.book-link')
    const bodys = document.querySelectorAll('body')
    const navbars = document.querySelectorAll('.navbar')
    if(currentTheme === 'Christmas'){
        buttons.forEach((button)=>{
            button.classList.remove('buttonEaster')
        })
        logoColor.forEach(logo => {
            logo.classList.remove('logoEaster')
        });
        bodys.forEach((body)=>{
            body.classList.remove('backgroundEaster')
        })
        navbars.forEach((navbar)=> {
            navbar.classList.remove('navbarEaster')
        })
        bookLink.classList.remove('borderEaster')
        buttons.forEach((button)=>{
            button.classList.add('buttonChristmas')
        })
        logoColor.forEach(logo => {
            logo.classList.add('christmasThemeRed')
        });
        bookLink.classList.add('borderChristmas')
    }
    if(currentTheme === 'Easter'){
        buttons.forEach((button)=>{
            button.classList.add('buttonEaster')
        })
        logoColor.forEach(logo => {
            logo.classList.add('logoEaster')
        });
        bodys.forEach((body)=>{
            body.classList.add('backgroundEaster')
        })
        navbars.forEach((navbar)=> {
            navbar.classList.add('navbarEaster')
        })
        bookLink.classList.add('borderEaster')
    }


    if(currentTheme === 'Default'){
        buttons.forEach((button)=>{
            button.classList.remove('buttonEaster')
        })
        logoColor.forEach(logo => {
            logo.classList.remove('logoEaster')
        });
        bodys.forEach((body)=>{
            body.classList.remove('backgroundEaster')
        })
        navbars.forEach((navbar)=> {
            navbar.classList.remove('navbarEaster')
        })
        bookLink.classList.remove('borderEaster')

        buttons.forEach((button)=>{
            button.classList.remove('buttonChristmas')
        })
        logoColor.forEach(logo => {
            logo.classList.remove('christmasThemeRed')
        });
        bookLink.classList.remove('borderChristmas')
    }
}

handleTheme()