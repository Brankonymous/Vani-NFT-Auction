import React from 'react';
 //<p style={{fontSize:28,marginBottom:0,fontFamily:'sans-serif',color:'black',backgroundColor:'#4CBE9F',borderRadius:0,width:'50%'}}> tekst 1 tekst 2 tekst 3 tekst4 ... </p>

function Info (props){

  return (
    <div style={{flexDirection:'row',alignItems: 'center',
      borderRadius:5,alignSelf:'center',
                  width:'100%',height:'40vh',borderColor:'black',borderWidth:5}}>
    
    <div>
          <img 
            src={props.NFT} 
            alt="display" 
            style={{marginTop:'0vh',borderRadius:15,height:150}}
          >
          </img>
          <p style={{
            fontSize: 24,
            marginBottom: 0,
            fontFamily:'sans-serif',
            color:'black',backgroundColor:'#4CBE9F',borderRadius:0}}>
                Name: {props.name} || Current Price: {props.price} || Date: {props.date}
          </p>
    </div>
    </div>
  )
}
export default Info;
