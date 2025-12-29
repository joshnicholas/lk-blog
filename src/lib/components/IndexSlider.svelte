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
    class="text-black cursor-pointer hover:opacity-70 select-none font-medium"
    onclick={goToPrev}
    disabled={selectedIndex <= minIndex}
  >
    Prev
  </button>
  
  <div class="flex-1 relative px-6">
    <input 
      type="range" 
      class="index-slider w-full h-4 cursor-pointer bg-transparent border border-black rounded-lg appearance-none"
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
    class="text-black cursor-pointer hover:opacity-70 select-none font-medium"
    onclick={goToNext}
    disabled={selectedIndex >= maxIndex}
  >
    Next
  </button>
</div>

<style>
  .index-slider::-webkit-slider-thumb {
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: black;
    cursor: pointer;
  }
  .index-slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: black;
    cursor: pointer;
    border: none;
  }

  button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
</style>