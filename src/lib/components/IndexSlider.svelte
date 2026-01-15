<!-- IndexSlider.svelte -->
<script>
  let { sortedData, selectedIndex = $bindable(0), increment = 4, indexBelow = false, scrolly = null } = $props();
  
  const minIndex = $derived(0);
  const maxIndex = $derived(sortedData.length - 1);
  const indexPosition = $derived(((selectedIndex - minIndex) / (maxIndex - minIndex)) * 100);

  const selectedDate = $derived(sortedData[selectedIndex]?.Date);

  function goToPrev() {
    if (selectedIndex > minIndex) {
      selectedIndex = Math.max(selectedIndex - increment, minIndex);
      scrolly?.scrollIntoView(false);
    }
  }

  function goToNext() {
    if (selectedIndex < maxIndex) {
      selectedIndex = Math.min(selectedIndex + increment, maxIndex);
      scrolly?.scrollIntoView(false);
    }
  }
</script>

<div class="mt-2.5 w-full flex items-center gap-2 py-5">
  <button
    class="slider-button select-none"
    onclick={goToPrev}
    disabled={selectedIndex <= minIndex}
  >
    Prev
  </button>

  <div class="flex-1 relative px-6">
    <input
      type="range"
      class="index-slider w-full h-4 cursor-pointer bg-transparent border rounded-lg appearance-none"
      min={minIndex}
      max={maxIndex}
      step={increment}
      bind:value={selectedIndex}
      oninput={() => {
        scrolly?.scrollIntoView(false);
      }}
    />
  </div>

  <button
    class="slider-button select-none"
    onclick={goToNext}
    disabled={selectedIndex >= maxIndex}
  >
    Next
  </button>
</div>