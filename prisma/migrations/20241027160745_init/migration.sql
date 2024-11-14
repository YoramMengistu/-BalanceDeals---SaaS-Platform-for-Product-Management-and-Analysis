-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('BASIC', 'PREMIUM', 'PRO');

-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCustomization" (
    "id" UUID NOT NULL,
    "classPrefix" TEXT,
    "productId" UUID NOT NULL,
    "locationMessage" TEXT NOT NULL DEFAULT 'Hey! It looks like you are from <b>{country}</b>. We support Parity Purchasing Power, so if you need it, use code <b>“{coupon}”</b> to get <b>{discount}%</b> off.',
    "backgroundColor" TEXT NOT NULL DEFAULT 'hsl(193, 82%, 31%)',
    "textColor" TEXT NOT NULL DEFAULT 'hsl(0, 0%, 100%)',
    "fontSize" TEXT NOT NULL DEFAULT '1rem',
    "bannerContainer" TEXT NOT NULL DEFAULT 'body',
    "isSticky" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "ProductCustomization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductView" (
    "id" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "countryId" UUID,
    "visitedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "countryGroupId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryGroup" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "recommendedDiscountPercentage" DOUBLE PRECISION,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "CountryGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryGroupDiscount" (
    "countryGroupId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "coupon" TEXT NOT NULL,
    "discountPercentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "CountryGroupDiscount_pkey" PRIMARY KEY ("countryGroupId","productId")
);

-- CreateTable
CREATE TABLE "UserSubscription" (
    "id" UUID NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "stripeSubscriptionItemId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripeCustomerId" TEXT,
    "tier" "Tier" NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "UserSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductCustomization_productId_key" ON "ProductCustomization"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CountryGroup_name_key" ON "CountryGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserSubscription_clerkUserId_key" ON "UserSubscription"("clerkUserId");

-- AddForeignKey
ALTER TABLE "ProductCustomization" ADD CONSTRAINT "ProductCustomization_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductView" ADD CONSTRAINT "ProductView_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductView" ADD CONSTRAINT "ProductView_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Country" ADD CONSTRAINT "Country_countryGroupId_fkey" FOREIGN KEY ("countryGroupId") REFERENCES "CountryGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryGroupDiscount" ADD CONSTRAINT "CountryGroupDiscount_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryGroupDiscount" ADD CONSTRAINT "CountryGroupDiscount_countryGroupId_fkey" FOREIGN KEY ("countryGroupId") REFERENCES "CountryGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
