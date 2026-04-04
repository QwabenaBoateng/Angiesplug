import os

target_file = r"c:\GitHub Projects\Angiesplug\src\pages\admin\Products.jsx"
layout_file = r"c:\GitHub Projects\Angiesplug\new_products_layout.jsx"

with open(target_file, "r", encoding="utf-8") as f:
    target_content = f.read()

with open(layout_file, "r", encoding="utf-8") as f:
    layout_content = f.read()

# find index of return
start_idx = target_content.find('  return (\n    <div className="space-y-6">')
if start_idx == -1:
    print("Error: Could not find start of layout")
    exit(1)

# Find the end: where the modal starts
end_idx = target_content.find('      {/* Product Modal */}')

if end_idx == -1:
    print("Error: Could not find end of layout")
    exit(1)

new_content = target_content[:start_idx] + "  return (\n" + layout_content + "\n" + target_content[end_idx:]

with open(target_file, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Successfully replaced layout!")
