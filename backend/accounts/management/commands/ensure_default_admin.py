from django.core.management.base import BaseCommand

import os

from accounts.models import User


class Command(BaseCommand):
    help = "Ensure the default admin user exists with the required credentials."

    def handle(self, *args, **options):
        email = os.environ.get("DEFAULT_ADMIN_EMAIL")
        password = os.environ.get("DEFAULT_ADMIN_PASSWORD")
        full_name = os.environ.get("DEFAULT_ADMIN_NAME", "Default Admin")

        if not email or not password:
            self.stdout.write(self.style.WARNING("DEFAULT_ADMIN_EMAIL or DEFAULT_ADMIN_PASSWORD not set."))
            return

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "full_name": full_name,
                "role": "admin",
            },
        )

        if not created:
            user.full_name = user.full_name or full_name
            user.role = "admin"

        user.set_password(password)
        user.save()

        action = "Created" if created else "Updated"
        self.stdout.write(self.style.SUCCESS(f"{action} default admin: {email}"))
