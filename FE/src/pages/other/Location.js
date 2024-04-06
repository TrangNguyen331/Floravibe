export function renderVietnamLocations(citisId, districtId, wardId, data) {
  const citis = document.getElementById(citisId);
  const districts = document.getElementById(districtId);
  const wards = document.getElementById(wardId);

  for (const city of data) {
    citis.options[citis.options.length] = new Option(city.Name, city.Id);
  }

  citis.onchange = function () {
    districts.length = 1;
    wards.length = 1;
    if (this.value !== "") {
      const result = data.filter((n) => n.Id === this.value);

      for (const district of result[0].Districts) {
        districts.options[districts.options.length] = new Option(
          district.Name,
          district.Id
        );
      }
    }
  };

  districts.onchange = function () {
    wards.length = 1;
    const cityData = data.filter((n) => n.Id === citis.value);
    if (this.value !== "") {
      const districtWards = cityData[0].Districts.find(
        (district) => district.Id === this.value
      ).Wards;

      for (const ward of districtWards) {
        wards.options[wards.options.length] = new Option(ward.Name, ward.Id);
      }
    }
  };
}
