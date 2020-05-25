 let sum =''
function availabe_cards(number,cards){
    if(number>=0 && number<=12){
          return clubs(number,cards)
    }else if(number>12 && number<=25){
           return diamond(number,cards)
    }else if(number>25 && number<=38){
            return heart(number,cards)
    }else if(number>38 && number===sum  && number<=51){
            return spade(number,cards)
    }
    }
    
    function clubs(sum,cards){
        let mycards =cards.filter((number)=>number>=0 && number===sum  && number<=12)
        if(mycards.length>0){
        return cards.filter((number)=>number>=0 && number<=12)
    }
    }
    
    function diamond(sum,cards){
    let mycards =cards.filter((number)=>number>12 && number===sum  && number<=25)
    if(mycards.length>0){
    return cards.filter((number)=>number>12 && number<=25)
    }
    }
    
    
    function heart(sum,cards){
        let mycards =cards.filter((number)=>number>25 && number===sum  && number<=38)
        if(mycards.length>0){
        return cards.filter((number)=>number>25 && number<=38)
        }
    }
    
    
    function spade(sum,cards){
        let mycards =cards.filter((number)=>number>38 && number===sum  && number<=51)
        if(mycards.length>0){
        return cards.filter((number)=>number>38 && number<=51)
        }
    }
    
    
    
module.exports={availabe_cards}    