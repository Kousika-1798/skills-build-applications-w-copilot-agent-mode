from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Workout, Leaderboard
from django.utils import timezone

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        # Clear existing data
        Leaderboard.objects.all().delete()
        Activity.objects.all().delete()
        Workout.objects.all().delete()
        User.objects.all().delete()
        Team.objects.all().delete()

        # Teams
        marvel = Team.objects.create(name='marvel', description='Marvel Team')
        dc = Team.objects.create(name='dc', description='DC Team')

        # Users
        users = [
            User.objects.create(email='tony@stark.com', name='Tony Stark', team='marvel', is_superhero=True),
            User.objects.create(email='steve@rogers.com', name='Steve Rogers', team='marvel', is_superhero=True),
            User.objects.create(email='bruce@wayne.com', name='Bruce Wayne', team='dc', is_superhero=True),
            User.objects.create(email='clark@kent.com', name='Clark Kent', team='dc', is_superhero=True),
        ]

        # Workouts
        workouts = [
            Workout.objects.create(name='Pushups', description='Do 50 pushups', suggested_for='marvel'),
            Workout.objects.create(name='Flight', description='Fly for 10 minutes', suggested_for='dc'),
        ]

        # Activities
        Activity.objects.create(user=users[0], type='run', duration=30, date=timezone.now().date())
        Activity.objects.create(user=users[1], type='swim', duration=20, date=timezone.now().date())
        Activity.objects.create(user=users[2], type='fly', duration=15, date=timezone.now().date())
        Activity.objects.create(user=users[3], type='lift', duration=25, date=timezone.now().date())

        # Leaderboard
        Leaderboard.objects.create(user=users[0], score=100, rank=1)
        Leaderboard.objects.create(user=users[1], score=90, rank=2)
        Leaderboard.objects.create(user=users[2], score=80, rank=3)
        Leaderboard.objects.create(user=users[3], score=70, rank=4)

        self.stdout.write(self.style.SUCCESS('octofit_db populated with test data!'))
