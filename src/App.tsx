import { useState } from 'react'
import { Button, Stack } from '@mui/material';


function App() {
  const [X,setX] = useState([1,2,3,4,5,6,7,8,0]);
  const [moving, setMoving] = useState(null);

  function shuffle(){
    let arr;
    do {
      arr = [1,2,3,4,5,6,7,8,0]
        .sort(() => Math.random() - 0.5);
    } while(!isSolvable(arr));
    setX(arr);
  }

  function isSolvable(arr){
    let inv = 0;
    for(let i=0; i<arr.length; i++){
      for(let j=i+1; j<arr.length; j++){
        if(arr[i] && arr[j] && arr[i] > arr[j]) inv++;
      }
    }
    return inv % 2 === 0;
  }

  function startTimer(){
    setTimeout(()=>{console.log("F")}, 3000);
  }

  function click(i){
    const newX = X.slice();
    if (newX[north(i)]===0){
      newX[north(i)] = newX[i]; newX[i] = 0;
      setMoving({idx:i-3, dx:0, dy:-1 });
    }
    else if(newX[south(i)]===0){
      newX[south(i)] = newX[i]; newX[i] = 0;
      setMoving({idx:i+3, dx:0, dy:1 });
    }
    else if(newX[east(i)]===0){
      newX[east(i)] = newX[i]; newX[i] = 0;
      setMoving({idx:i+1, dx:1, dy:0 });
    }
    else if(newX[west(i)]===0){
      newX[west(i)] = newX[i]; newX[i] = 0;
      setMoving({idx:i-1, dx:-1, dy:0 });
    }
    else return;
    setX(newX);
    setTimeout(()=>{setMoving(null)}, 200);
  }

  function idx2pos(i){
    return {c:i%3, r:Math.floor(i/3)};
  }

  function north(i){ const pos = idx2pos(i); return pos.r>0 ? 3*(pos.r-1)+pos.c : -1; }
  function south(i){ const pos = idx2pos(i); return pos.r<2 ? 3*(pos.r+1)+pos.c : -1; }
  function west(i){  const pos = idx2pos(i); return pos.c>0 ? 3*pos.r+(pos.c-1) : -1; }
  function east(i){  const pos = idx2pos(i); return pos.c<2 ? 3*pos.r+(pos.c+1) : -1; }

  function completed(){
    for (let i=0; i<X.length; i++){
      if (X[i] !== (i+1)%9) return false;
    }
    return true;
  }

  function Completed(){
    return <h2>{completed() ? "完成です！" : "未完成です"}</h2>
  }

  function Piece({i}){
    const text = (X[i]===0)?"":X[i]
    const color = (X[i]===0)?"none":"palegreen"
    const stroke = (X[i]===0)?"none":"white"
    const x = 100*(i%3);
    const y = 100*(Math.floor(i/3));
    let dx = 0, dy = 0;
    if (moving?.idx===i){
      dx = -50*moving.dx;
      dy = -50*moving.dy;
    }
    const trans = `translate(${x+dx},${y+dy})`;
    return <g onClick={()=>click(i)} transform={trans} style={{cursor:"pointer"}}>
        <rect fill={color} stroke={stroke}
            x={0} y={0} width={100} height={100}></rect>
        <text x={50} y={55} stroke="black" 
              textAnchor="middle" fontSize="24">{text}</text>
      </g>  
  }

  function Board(){
    return X.map((_,i)=><Piece key={i} i={i}/>);
  }

  return(
    <>
      <Stack spacing={1}>
        <Completed/>
        <Stack direction="row" spacing={1}>
          <Button onClick={shuffle} variant="contained"> Shuffle </Button>
          <Button onClick={()=>setX([1,2,3,4,5,6,7,8,0])} variant="contained"> Solve </Button>
        </Stack>
        <svg width={310} height={310}>
          <Board/>
        </svg>
        <Button onClick={startTimer} variant='outlined'>timer</Button>
      </Stack>
    </>
  )
}

export default App;
