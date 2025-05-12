export const openPopup = (title, image) => {
    const bookTitle = document.querySelector('.review-book-title')
    const bookImage = document.querySelector('.review-book-img')
    const overlay = document.querySelector('.site-overlay')
    const popup = document.querySelector('.review-popup')

    overlay.style.display = 'block'
    popup.style.display = 'flex'



    bookTitle.innerHTML = title
    bookImage.src = image
}

export const closePopup = () => {
    const overlay = document.querySelector('.site-overlay')
    const popup = document.querySelector('.review-popup')
    overlay.style.display = 'none'
    popup.style.display = 'none'
}