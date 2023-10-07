var originalCoordinates = [
   [11.338742079290764, 108.89905918790635],
   [11.338166628796698, 108.89967799004427],
   [11.338961000370086, 108.90054558891804],
   [11.339642782085296, 108.89990126916618],
   [11.33901103945037, 108.89918039657253],
   [11.338742079290764, 108.89905918790635]
];

function ConvertCoordinates(originalCoordinates) {
   var res = [];
   for (var i = 0; i < originalCoordinates.length; i++) {
      var coord = originalCoordinates[i];
      // Chuyển đổi thứ tự kinh độ và vĩ độ
      var newCoord = [coord[1], coord[0]];
      res.push(newCoord);
   }
   return res;
}

var pondData = {
   "type": "FeatureCollection",
   "features": [
      {
         "type": "Feature",
         "id": "01",
         "properties": {
            "code": "Đ1",
            "name": "Đầm 1",
            "status": 1
         },
         "geometry": {
            "type": "Polygon",
            "coordinates": [
               ConvertCoordinates(originalCoordinates)
            ]
         }
      }
   ]
};