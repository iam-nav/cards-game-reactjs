function PlayersJoin(number){
const people = number
const total = 53
const exactPair = total/people  
return exactPair 
}



function deck(){
    const TotalCards =[]
    for(var i = 52; i >= 0; i--){
    TotalCards.push(i)
    }
    return TotalCards
}

//shuffle the  deck
function shuffle(arra1) {
    var ctr = arra1.length, temp, index;
// While there are elements in the array
    while (ctr > 0) {
// Pick a random index
        index = Math.floor(Math.random() * ctr);
// Decrease ctr by 1
        ctr--;
// And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}

//DistributeCards to the players
const chunkArray = (myArray, chunk_size)=>{
    var index = 1;
    var arrayLength = myArray.length;
    var tempArray = [];
    
    for (index = 0; index < arrayLength; index += chunk_size) {
      const myChunk = myArray.slice(index, index+chunk_size);
        tempArray.push(myChunk);
    }

    const latestLength=  tempArray.length-1
    if(tempArray[latestLength].length===1){
        const lastelement =tempArray[latestLength][0]
        tempArray[latestLength-1].push(lastelement)
        tempArray[latestLength].pop()
    }
    return tempArray;
}
    const DeleteCard=(Current_Cards,removeCard)=>{
        return Current_Cards.filter((Current_Cards)=>{
            return removeCard!==Current_Cards
        })
    }


module.exports ={
    shuffle:shuffle,
    deck:deck,
    DistributeCards:chunkArray,
    PlayersJoin:PlayersJoin,
    DeleteCard:DeleteCard,
}
