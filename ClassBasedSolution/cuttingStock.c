#include <stdio.h>
#include <stdlib.h>

#define MAX_CUTS 100
#define MAX_BARS 100
#define MAX_CUTS_PER_BAR 50

typedef struct {
  int length;
  int qty;
} CutSpec;

typedef struct {
  int cuts[MAX_CUTS_PER_BAR];
  int cutCount;
  int remaining;
} Bar;

// expand Cut specs into indivial cuts
int expandCuts(CutSpec specs[], int specCount, int cuts[]) {
  int index = 0;

  for (int i = 0; i < specCount; i++) {
    for (int j = 0; j < specs[i].qty; j++) {
      cuts[index++] = specs[i].length;
    }
  }
  return index;
}

void sortDescending(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    for (int j = i + 1; j < n; j++) {
      if (arr[j] > arr[i]) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
  }
}

/* find best bar for a cut*/

int findBestBar(Bar bars[], int barCount, int cut) {
  int bestIndex = -1;
  int minRemaining = 1000000;

  for (int i = 0; i < barCount; i++) {
    int remainingAfter = bars[i].remaining - cut;
    if (remainingAfter >= 0 && remainingAfter < minRemaining) {
      minRemaining = remainingAfter;
      bestIndex = i;
    }
  }
  return bestIndex;
}

int main() {
  CutSpec input[] = {{6000, 2}, {4500, 1}, {3000, 2}, {1500, 1}};

  int stockLength = 12000;
  int cuts[MAX_CUTS];
  Bar bars[MAX_BARS];

  int specCount = sizeof(input) / sizeof(input[0]);
  int cutCount = expandCuts(input, specCount, cuts);

  sortDescending(cuts, cutCount);

  int barCount = 0;

  for (int i = 0; i < cutCount; i++) {
    int cut = cuts[i];
    int index = findBestBar(bars, barCount, cut);
    if (index != -1) {
      bars[index].cuts[bars[index].cutCount++] = cut;
      bars[index].remaining -= cut;
    } else {
      bars[barCount].cuts[0] = cut;
      bars[barCount].cutCount = 1;
      bars[barCount].remaining = stockLength - cut;
      barCount++;
    }
  }

  for (int i = 0; i < barCount; i++) {
    printf("Bar %d: Cuts = ", i + 1);
    for (int j = 0; j < bars[i].cutCount; j++) {
      printf("%d ", bars[i].cuts[j]);
    }
    printf("! waste = %d\n", bars[i].remaining);
  }
  return 0;
}
