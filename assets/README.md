# Assets Directory

## Floor Plan Image

Place your floor plan image here with the filename: **floorplan.png**

### Requirements:
- **Format**: PNG, JPG, or JPEG
- **Recommended dimensions**: Any size (will be scaled automatically)
- **Coordinate system**: Should match the backend map bounds (101.12m × 123.64m)

### File location:
```
/assets/floorplan.png
```

The app will automatically scale the image and map pixel coordinates to meter coordinates for hex grid selection.

### For testing without an image:
The app includes a fallback that generates theoretical hex grid centers, so it will still function for development purposes.
