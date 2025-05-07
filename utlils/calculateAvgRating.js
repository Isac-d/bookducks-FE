export const calculateRating = (reviews) => {
    let sumOfRatings = 0
    if(reviews.length === 0){
        return 0;
    }
    let arrOfRatings = reviews.map((review)=>{
        return review.rating / 2
    })
    for(let i = 0; i<arrOfRatings.length; i++){
        sumOfRatings += arrOfRatings[i]
    }
    const avgRating = sumOfRatings / arrOfRatings.length

    // round the rating so that it only returns halves or full numbers
    const roundedRating = Math.round(avgRating * 2) / 2
    return roundedRating
}