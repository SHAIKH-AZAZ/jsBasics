function cutStock(cuts, stockLength) {
    // 1 sort cuts 
    cuts.sort((a, b) => b - a)

    let bars = []

    // 2 process each cut
    for (const cut of cuts) {
        let bestBarIndex = -1
        let minRemainingAfter = Infinity

        // 3 find best fir bar
        for (let i = 0; i < bars.length; i++) {
            let remainingAfter = bars[i].remaining - cut

            if (remainingAfter >= 0 && remainingAfter < minRemainingAfter) {
                minRemainingAfter = remainingAfter
                bestBarIndex = i
            }
        }

        if (bestBarIndex !== -1) {
            bars[bestBarIndex].cuts.push(cut);
            bars[bestBarIndex].remaining -= cut
        } else {
            bars.push({
                remaining: stockLength - cut,
                cuts: [cut]
            })
        }

    }
    return bars
}

cuts = [6000, 6000, 6000, 4500, 4500, 3000, 3000, 3000, 1500, 1500]
stock = 12000


let test = cutStock(cuts, stock)
console.log(test);
