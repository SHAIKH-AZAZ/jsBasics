#include <iostream>
#include <string>
#include <vector>
#include "CuttingStockOptimizer.h"

// VERY SIMPLE JSON PARSER (SAFE FOR OUR FORMAT)
int extractInt(const std::string& src, const std::string& key) {
    auto pos = src.find(key);
    if (pos == std::string::npos) return 0;
    pos = src.find(":", pos);
    return std::stoi(src.substr(pos + 1));
}

std::vector<Cut> extractCuts(const std::string& src) {
    std::vector<Cut> cuts;
    size_t pos = src.find("\"cuts\"");
    pos = src.find("[", pos);

    while (true) {
        size_t idPos = src.find("\"id\"", pos);
        if (idPos == std::string::npos) break;

        size_t lenPos = src.find("\"length\"", idPos);

        int id = std::stoi(src.substr(src.find(":", idPos) + 1));
        int length = std::stoi(src.substr(src.find(":", lenPos) + 1));

        cuts.push_back({id, length});
        pos = lenPos;
    }
    return cuts;
}

int main() {
    // Read entire stdin
    std::string input((std::istreambuf_iterator<char>(std::cin)),
                       std::istreambuf_iterator<char>());

    int stockLength = extractInt(input, "stockLength");
    int scrapThreshold = extractInt(input, "scrapThreshold");
    std::vector<Cut> cuts = extractCuts(input);

    CuttingStockOptimizer optimizer(stockLength, scrapThreshold);
    optimizer.optimize(cuts);

    std::cout << optimizer.toJson();
    return 0;
}
