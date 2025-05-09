import { isUserSignedIn } from "./isUserSignedIn.js"
const renderIfSignedIn = () => {
  
    const buttonContainers = document.querySelectorAll('.button-container')
    const reviewReadlist = document.querySelector('.review-readlist')
    const logOutButton = document.querySelector('.log-Out')
    const logInbutton = document.querySelector('.log-in')
    const logInToReview = document.querySelector('.log-in-to-review')
    
    logOutButton.addEventListener('click', window.refresh)
    
  
    
    const signedIn = isUserSignedIn();
    console.log(buttonContainers)
    
    logInbutton.style.display = signedIn ? 'none' : 'flex'
    logOutButton.style.display = signedIn ? 'flex' : 'none'

    if(logInToReview){
        logInToReview.style.display = signedIn ? 'none' : 'flex'
        reviewReadlist.style.display = signedIn ? 'flex' : 'none' 
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderIfSignedIn();
  });