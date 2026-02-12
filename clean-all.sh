#!/bin/bash

echo "⚠️  WARNING: This will DELETE ALL DATA!"
echo "======================================"
echo "This includes:"
echo "  - All user accounts"
echo "  - All events"
echo "  - All bookings"
echo "  - All database data"
echo ""
read -p "Are you sure? (type 'yes' to confirm): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Cancelled"
    exit 0
fi

echo ""
echo "🗑️  Stopping and removing all containers and volumes..."
docker-compose down -v

echo ""
echo "✅ All data has been deleted!"
echo "💡 Run ./start-all.sh to start fresh"
echo "======================================"
