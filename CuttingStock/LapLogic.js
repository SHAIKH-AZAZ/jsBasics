function splitWithLap(cuttingLength , lapLength , stockLength = 12){
    if (cuttingLength <= stockLength) {
        return {
            segments: [cuttingLength],
            laps:0
        }
    }

    const usable = stockLength - lapLength;
    const segments =[];
    let remaining = cuttingLength;

    while (remaining > usable) {
        
        segments.push(usable   )
        remaining -= usable;
    }

    segments.push(remaining);

    return {
        segments,
        laps:segments.length -1
    }
}



let result =splitWithLap(589, 1);
console.log(result);
