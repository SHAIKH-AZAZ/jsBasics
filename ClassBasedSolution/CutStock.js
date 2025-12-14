class CuttingStockOptimizer {
    constructor(stockLength) {
        this.stockLength = stockLength
        this.bars = []
    }

    optmize(cuts) {
        // defensive copy + sort
        const sortedCuts = [...cuts].sort((a, b) => b - a);

        for (const cut of sortedCuts) {
            this.placeCut(cut)
        }

        return this.getResult();
    }

    placeCut(cut) {
        const bestBarIndex = this.findBestBar(cut);

        if (bestBarIndex !== -1) {
            const bar = this.bars[bestBarIndex]
            bar.cuts.push(cut)
            bar.remaining -= cut
        } else {
            this.bars.push({
                cuts: [cut],
                remaining: this.stockLength - cut
            })
        }
    }

    findBestBar(cut) {
        let bestIndex = -1
        let minRemainingAfter = Infinity

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
        return this.bars.map((bar, index) => ({
            barNo: index + 1,
            cuts: bar.cuts,
            waste: bar.remaining
        }))
    }
}


const optmizer = new CuttingStockOptimizer(12000);
const cuts = [6000, 6000, 4500, 3000, 3000, 1500];
const result = optmizer.optmize(cuts);

console.log(result);
