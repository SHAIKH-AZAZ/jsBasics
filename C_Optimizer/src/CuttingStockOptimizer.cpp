#include "CuttingStockOptimizer.h"
#include <algorithm>
#include <sstream>

CuttingStockOptimizer::CuttingStockOptimizer(int stockLength, int scrapThreshold)
    : stockLength(stockLength), scrapThreshold(scrapThreshold) {}

int CuttingStockOptimizer::findBestBar(int cut)
{
    auto it = barSet.lower_bound({cut, -1});
    return (it == barSet.end()) ? -1 : it->second;
}

void CuttingStockOptimizer::optimize(const std::vector<Cut> &inputCuts)
{
    std::vector<Cut> cuts = inputCuts;

    std::sort(cuts.begin(), cuts.end(),
              [](const Cut &a, const Cut &b)
              {
                  return a.length > b.length;
              });

    for (const auto &cut : cuts)
    {
        if (cut.length > stockLength)
            continue;

        int barIndex = findBestBar(cut.length);

        if (barIndex != -1)
        {
            auto it = barSet.find({bars[barIndex].remaining, barIndex});
            if (it != barSet.end())
                barSet.erase(it);

            bars[barIndex].cutIds.push_back(cut.id);
            bars[barIndex].remaining -= cut.length;

            if (bars[barIndex].remaining > scrapThreshold)
            {
                barSet.insert({bars[barIndex].remaining, barIndex});
            }
        }
        else
        {
            Bar bar;
            bar.remaining = stockLength - cut.length;
            bar.cutIds.push_back(cut.id);

            int newIndex = bars.size();
            bars.push_back(bar);

            if (bar.remaining > scrapThreshold)
            {
                barSet.insert({bar.remaining, newIndex});
            }
        }
    }
}

std::string CuttingStockOptimizer::toJson() const
{
    std::ostringstream out;
    out << "{ \"bars\": [";

    for (size_t i = 0; i < bars.size(); i++)
    {
        const Bar &bar = bars[i];
        out << "{";
        out << "\"barNo\": " << (i + 1) << ", ";
        out << "\"remaining\": " << bar.remaining << ", ";
        out << "\"cutIds\": [";

        for (size_t j = 0; j < bar.cutIds.size(); j++)
        {
            out << bar.cutIds[j];
            if (j + 1 < bar.cutIds.size())
                out << ", ";
        }

        out << "] }";
        if (i + 1 < bars.size())
            out << ", ";
    }

    out << "] } ";
    return out.str();
}

const std::vector<Bar> &CuttingStockOptimizer::getBars() const
{
    return bars;
}
