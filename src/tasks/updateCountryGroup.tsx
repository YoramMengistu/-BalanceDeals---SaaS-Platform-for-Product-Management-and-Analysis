import countriesByDiscount from "@/data/countriesByDiscount.json";
import prisma from "@/prisma/prisma";

const groupCount = await updateCountryGroups();
const countryCount = await updateCountries();

console.log(
  `Update ${groupCount} country groups and ${countryCount} countries`
);


async function updateCountryGroups() {
    const countryGroupInsertData = countriesByDiscount.map(
      ({ name, recommendedDiscountPercentage }) => {
        return { name, recommendedDiscountPercentage }
      }
    )
  
    const promises = countryGroupInsertData.map(async (data) => {
      const existingGroup = await prisma.countryGroup.findUnique({
        where: { name: data.name },
      })
  
      if (existingGroup) {
        return prisma.countryGroup.update({
          where: { id: existingGroup.id },
          data: { recommendedDiscountPercentage: data.recommendedDiscountPercentage },
        })
      } else {
        return prisma.countryGroup.create({
          data,
        })
      }
    })
  
    const results = await Promise.all(promises)
    return results.length
  }
  
  async function updateCountries() {
    const countryGroups = await prisma.countryGroup.findMany({
      select: { id: true, name: true },
    })
  
    const countryInsertData = countriesByDiscount.flatMap(
      ({ countries, name }) => {
        const countryGroup = countryGroups.find(group => group.name === name)
        if (countryGroup == null) {
          throw new Error(`Country group "${name}" not found`)
        }
  
        return countries.map(country => {
          return {
            name: country.countryName,
            code: country.country,
            countryGroupId: countryGroup.id,
          }
        })
      }
    )
  
    const promises = countryInsertData.map(async (data) => {
      const existingCountry = await prisma.country.findUnique({
        where: { code: data.code },
      })
  
      if (existingCountry) {
        return prisma.country.update({
          where: { id: existingCountry.id },
          data: {
            name: data.name,
            countryGroupId: data.countryGroupId,
          },
        })
      } else {
        return prisma.country.create({
          data,
        })
      }
    })
  
    const results = await Promise.all(promises)
    return results.length
  }
