import { isUserSignedIn } from "./isUserSignedIn.js"
const renderIfSignedIn = () => {
  
    const buttonContainers = document.querySelectorAll('.button-container')
    const logOutButton = document.querySelector('.log-Out')
    const logInbutton = document.querySelector('.log-in')
    const logInButtonHome = document.querySelector('.log-in-button')
    const ctaLink = document.querySelector('.log-in-link')
    const mypagesLink = document.querySelector('.my-pages')


    
    logOutButton.addEventListener('click', ()=>window.location.reload())
    
    
    
    const signedIn = isUserSignedIn();
    console.log(buttonContainers)
    
    logInbutton.style.display = signedIn ? 'none' : 'flex'
    logOutButton.style.display = signedIn ? 'flex' : 'none'
    mypagesLink.style.display = signedIn ? 'block' : 'none'
    if(logInButtonHome){
      logInButtonHome.innerHTML = signedIn ? 'MY PAGES' : 'LOG IN'
      ctaLink.href = !signedIn ? 'pages/login/login.html' : 'pages/mypages/mypages.html'
    }
    
    
 
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderIfSignedIn();
  });