
 const two_Players=(first,second)=>{
    let largest_num= [first,second]
    let largest = largest_num.sort((a,b)=>a-b).reverse()[0];
    return largest
  }

  const three_Players=(first,second,third)=>{
    let largest_num= [first,second,third]
    let largest = largest_num.sort((a,b)=>a-b).reverse()[0];
    return largest
  }

  
  const Four_Players=(first,second,third,fourth)=>{
    let largest_num= [first,second,third,fourth]
    let largest = largest_num.sort((a,b)=>a-b).reverse()[0];
    return largest
  }

module.exports = {two_Players,three_Players,Four_Players}
  