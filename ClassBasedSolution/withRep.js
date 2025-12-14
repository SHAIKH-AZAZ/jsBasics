function expandCuts(cutSpecs) {
    const cuts = []

    for (const spec of cutSpecs) {
        for (let i = 0; i < spec.qty; i++) {
            cuts.push(spec.length)
        }
    }
    return cuts
}


class CuttingStockOptimizer {
    constructor(stockLength) {
        this.stockLength = stockLength
        this.bars = []
    }

    optimize(cuts) {
        const sortedCuts = [...cuts].sort((a, b) => b - a);

        for (const cut of sortedCuts) {
            this.placeCut(cut);
        }
        return this.getResult();
    }

    placeCut(cut) {
        const index = this.findBestBar(cut);

        if (index !== -1) {
            this.bars[index].cuts.push(cut)
            this.bars[index].remaining -= cut
        } else {
            this.bars.push({
                cuts: [cut],
                remaining: this.stockLength - cut
            });
        }
    }

    findBestBar(cut) {
        let bestIndex = -1;
        let minRemainingAfter = Infinity;

        for (let i = 0; i < this.bars.length; i++) {
            const remainingAfter = this.bars[i].remaining - cut
            if (remainingAfter >= 0 && remainingAfter < minRemainingAfter) {
                minRemainingAfter = remainingAfter;
                bestIndex = i
            }
        }
        return bestIndex
    }


    getResult() {
        return this.bars.map((bar, i) => ({
            barNo: i + 1,
            cuts: bar.cuts,
            waste: bar.remaining
        }));
    }
}



const input = [
    { length: 6000, qty: 2 },
    { length: 4500, qty: 1 },
    { length: 3000, qty: 2 },
    { length: 1500, qty: 1 }
];

const stockLength = 12000;


// expand cutting lenghts

const cuts = expandCuts(input)


// optmize 
const optimizer = new CuttingStockOptimizer(stockLength)

const result = optimizer.optimize(cuts)
console.log(result);
