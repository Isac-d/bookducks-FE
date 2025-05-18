import { fetchUser } from "../../utlils/getUserRating.js"

const userInfo = await fetchUser()
const welcomeText = document.querySelector('.welcome-text')
console.log(userInfo)

welcomeText.innerHTML = `Welcome ${userInfo.username}`