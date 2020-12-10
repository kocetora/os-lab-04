# os-lab-02

## Example
```cpp
void test(Allocator* allocator, size_t memorySize, record records[], size_t recordsSize, size_t iterCount)
{
	srand((unsigned)time(NULL));
	size_t maxBlockSize = memorySize / recordsSize * 4;
	for (size_t i = 0; i < iterCount; i++)
	{
		cout << "*******************************************************\n";
		cout << (i + 1) << " iteration" << "\n";

		size_t block = (size_t)(rand() % recordsSize);
		if (records[block].ptr == NULL)
			//allocate memory
		{
			size_t bytes = (size_t)(rand() % maxBlockSize);
			if (bytes == 0)
			{
				bytes++;
			}
			cout << "mem_alloc(" << bytes << ") record #" << block << "\n";
			void* ptr = allocator->mem_alloc(bytes);
			if (ptr != NULL)
			{
				records[block].ptr = ptr;
				records[block].size = bytes;
				records[block].checksum = fillBlock((size_t*)ptr, bytes); //save checksum
			}
			cout << "ptr = " << ptr << "\n";
		}
		else
		{   //compare checksum with saved value
			if (records[block].checksum != getChecksum((size_t*)records[block].ptr, records[block].size))
			{
				cout << "Checksum of block [" << block << "] is not valid\n";
				return;
			}
			int a = rand() % 2;
			if (a == 0)
				//free memory
			{
				cout << "mem_free(" << records[block].ptr << ") record #" << block << "\n";
				allocator->mem_free(records[block].ptr);
				records[block].ptr = NULL;
			}
			else
				//reallocate memory
			{
				size_t oldSize = records[block].size;
				size_t bytes = (size_t)(rand() % maxBlockSize);
				cout << "mem_realloc(" << records[block].ptr << ", " << bytes << ") record #" << block << "\n";
				void* ptr = allocator->mem_realloc(records[block].ptr, bytes);
				if (ptr != NULL)
				{
					records[block].ptr = ptr;
					if (bytes > oldSize) {
						size_t gap = bytes - oldSize;
						size_t* ptr2 = (size_t*)(ptr);
						for (size_t i = 0; i < oldSize; i += 4) {
							ptr2++;
						}
						fillBlock(ptr2, gap);
					}
					records[block].checksum = getChecksum((size_t*)ptr, bytes);
				}
				cout << "ptr = " << ptr << "\n";
			}
		}
		if (iterCount <= outputLimit) {
			allocator->mem_dump();
			cout << "*******************************************************\n";
		}
	}
}
```
![Console output:](https://github.com/kocetora/os-lab-02/blob/master/assets/md/1.png)

## Class Allocator public methods
- `void* mem_alloc(size_t size)`  
return address on begin of allocated block or NULL
- `void* mem_realloc(void* ptr, size_t size)`  

- `void mem_free(void* ptr)`  

- `void mem_dump()`  

### Header structure
```cpp
enum pageState { FREE, BUSY, ZONE };

struct zoneHeader
{
	zoneHeader* nextZone = NULL;
	void* firstFreeBlock = NULL;
	size_t ctrFree;
};

struct pageHeader
{
	pageState state = FREE;
	size_t sizeOfBlock; // small inner block for zones, number of pages which makes up large block otherwise
	zoneHeader* zone = NULL;
};
```