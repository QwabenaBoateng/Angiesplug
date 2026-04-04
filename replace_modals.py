import os

target_file = r"c:\GitHub Projects\Angiesplug\src\pages\admin\Products.jsx"
modals_file = r"c:\GitHub Projects\Angiesplug\new_modals.jsx"

with open(target_file, "r", encoding="utf-8") as f:
    target_content = f.read()

with open(modals_file, "r", encoding="utf-8") as f:
    modals_content = f.read()

# find index of {/* Product Modal */}
start_idx = target_content.find("{/* Product Modal */}")

if start_idx == -1:
    print("Error: Could not find start of modals")
    exit(1)

# Find the end of the Brand Modal
end_idx = target_content.rfind("    </div>\n  )\n}")

if end_idx == -1:
    print("Error: Could not find end of modals")
    exit(1)

new_content = target_content[:start_idx] + modals_content + "\n" + target_content[end_idx:]

with open(target_file, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Successfully replaced modals!")
