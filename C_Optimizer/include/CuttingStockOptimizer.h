#ifndef CUTTING_STOCK_OPTIMIZER_H
#define CUTTING_STOCK_OPTIMIZER_H

#include <vector>
#include <set>
#include <string>

struct Cut
{
    int id;
    int length;
};

struct Bar
{
    int remaining;
    std::vector<int> cutIds;
};

class CuttingStockOptimizer
{
public:
    CuttingStockOptimizer(int stockLength, int scrapThreshold);

    void optimize(const std::vector<int> &inputCuts);

    std::string toJson() const;

    void optimize(const std::vector<Cut> &cuts);

    const std::vector<Bar> &getBars() const;

private:
    int stockLength;
    int scrapThreshold;

    std::vector<Bar> bars;
    std::multiset<std::pair<int, int>> barSet;

    int findBestBar(int cut);
};

#endif
