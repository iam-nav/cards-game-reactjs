let arr = []

export const settingPlayers = (totalPlayers)=>{
for (let index = 0; index < totalPlayers; index++) {  
    arr.push(index)
}
    return arr
}
export const findingTurn = async(totalplayers,currentPlayer)=>{
const playersRemaing = await totalplayers.filter((num)=>num!==currentPlayer)
const playerTurn  = await Math.min(...playersRemaing)
return  {playersRemaing,playerTurn}
}

export const removeDuplicate = (arr)=>{
   return arr.filter( function( item, index, inputArray ) {
        return inputArray.indexOf(item) == index;
 })
}


// module.exports ={settingPlayers,findingTurn,removeDuplicate}