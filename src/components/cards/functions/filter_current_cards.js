const sum =''
export const availabe_cards=(number,cards)=>{
    if(number>=0 && number<=12){
          return clubs(number,cards)
    }else if(number>12 && number<=25){
           return diamond(number,cards)
    }else if(number>25 && number<=38){
            return heart(number,cards)
    }else if(number>38 && number<=51){
            return spade(number,cards)
    }
    }
    
    const clubs=(sum,cards)=>{
        return cards.filter((number)=>number>=0 && number<=12)
    }
    
    
    const diamond=(sum,cards)=>{
    return cards.filter((number)=>number>12 && number<=25)
    }
    
    
    
    const heart=(sum,cards)=>{
        return cards.filter((number)=>number>25 && number<=38)
        }
    
    
    
    const spade=(sum,cards)=>{
        return cards.filter((number)=>number>38 && number<=51)
        }
    

        
export function removeFromLatestCards(original, remove) {
    return original.filter(value => !remove.includes(value));
  }
