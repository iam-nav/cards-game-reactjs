
 const two_Players=(first,second)=>{
    let largest_num= [first,second]
    let largest = largest_num.sort((a,b)=>a-b).reverse()[0];
    return largest
  }

module.exports = {two_Players}
  